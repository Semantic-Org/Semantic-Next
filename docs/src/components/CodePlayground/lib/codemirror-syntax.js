export function defineSyntax(CodeMirror) {
  CodeMirror.defineMode('ui-template', function() {
    return {
      startState: function() {
        return {
          inExpression: false,
          inAttribute: false,
          attributeQuoteChar: null,
        };
      },
      token: function(stream, state) {
        // Check if entering an expression outside of an attribute
        if (!state.inExpression && !state.inAttribute && stream.match('{{')) {
          state.inExpression = true;
          return 'bracket';
        }

        // Inside an expression (outside of an attribute)
        if (state.inExpression && !state.inAttribute) {
          if (stream.match('}}')) {
            state.inExpression = false;
            return 'bracket';
          }
          if (stream.match(/#(?:if|each|snippet)/) || stream.match(/\/(?:if|each|snippet)/) || stream.match('else')) {
            return 'keyword templating';
          }
          if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*|\@[a-zA-Z_][a-zA-Z0-9_]*/)) {
            return 'variable templating';
          }
          stream.next();
          return null;
        }

        // Handle HTML tags and attributes explicitly
        if (stream.eat('<')) {
          // Start of a tag
          stream.eatWhile(/[a-zA-Z_-]/); // Consume tag name
          return 'tag';
        } else if (stream.eat('/')) {
          // Closing tag
          stream.eatWhile(/[a-zA-Z_-]/);
          return 'tag';
        } else if (stream.eatWhile(/\s/)) {
          // Whitespace
          return null;
        } else if (stream.eat('>')) {
          // End of a tag
          return 'tag';
        } else if (state.inAttribute) {
          // Inside an attribute value
          if (state.inExpression) {
            // Inside an expression within the attribute
            if (stream.match('}}')) {
              state.inExpression = false;
              return 'bracket';
            }
            if (stream.match(/@[a-zA-Z_][a-zA-Z0-9_]*/)) {
              return 'variable templating';
            }
            if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
              return 'variable templating';
            }
            stream.next();
            return null;
          } else {
            // Regular attribute value text
            if (stream.match('{{')) {
              state.inExpression = true;
              return 'bracket';
            }
            if (stream.eat(state.attributeQuoteChar)) {
              // End of attribute value
              state.inAttribute = false;
              state.attributeQuoteChar = null;
            } else {
              stream.eatWhile(/[^"'/{}]/); // Consume attribute value until quote, expression, or end of line
            }
            return 'templating string';
          }
        } else {
          // Outside of tags and attributes
          // Check for start of an attribute
          stream.eatWhile(/[a-zA-Z_-]/); // Potential attribute name
          if (stream.eat('=')) {
            // Attribute assignment
            state.inAttribute = true;
            if (stream.eat('"') || stream.eat("'")) {
              state.attributeQuoteChar = stream.current().slice(-1);
            }
            return 'attribute';
          } else {
            stream.next(); // Consume a single character
            return null;
          }
        }
      }
    };
  });
  CodeMirror.defineMIME('text/ui-template', 'ui-template');
}
