import { defineComponent, getText } from '@semantic-ui/component';
import { isEmpty, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  schema: [],  // Form field definitions
  submitLabel: 'Submit',
  validateOnChange: true,
  onSubmit: null  // Callback for form submission
};

const defaultState = {
  values: {},       // Form field values
  errors: {},       // Validation errors
  touched: {},      // Which fields have been interacted with
  submitting: false, // Form submission status
  valid: true,      // Overall form validity
  openDropdown: null // Track open dropdown for select fields
};

const createComponent = ({ self, state, settings, reaction, flush, dispatchEvent, $, afterFlush }) => ({
  initialize() {
    // Create empty fields based on schema
    const initialValues = {};
    const schema = settings.schema || [];
    
    schema.forEach(field => {
      initialValues[field.name] = field.defaultValue || '';
    });
    
    state.values.set(initialValues);
    
    // Setup validation reactions
    self.setupValidation();
  },
  
  // Use reaction system for validation
  setupValidation() {
    reaction(() => {
      // This will re-run whenever values change
      const values = state.values.get();
      const errors = {};
      let isValid = true;
      
      // Apply validation rules
      (settings.schema || []).forEach(field => {
        if (field.validation) {
          const value = values[field.name];
          const error = field.validation(value, values);
          
          if (error) {
            errors[field.name] = error;
            isValid = false;
          }
        }
      });
      
      state.errors.set(errors);
      state.valid.set(isValid);
    });
  },
  
  // Field getters
  getFieldValue(name) {
    return state.values.get()[name];
  },
  
  getFieldError(name) {
    return state.errors.get()[name];
  },
  
  isFieldTouched(name) {
    return state.touched.get()[name] === true;
  },
  
  shouldShowError(name) {
    return self.isFieldTouched(name) && self.getFieldError(name);
  },
  
  // Field mutation methods
  setFieldValue(name, value) {
    state.values.setProperty(name, value);
    
    // Mark field as touched
    if (!self.isFieldTouched(name)) {
      state.touched.setProperty(name, true);
    }
    
    dispatchEvent('field-change', { name, value });
  },
  
  // Form submission
  async submitForm() {
    if (state.submitting.get()) return;
    
    // Mark all fields as touched
    const touchedState = {};
    (settings.schema || []).forEach(field => {
      touchedState[field.name] = true;
    });
    state.touched.set(touchedState);
    
    // Force validation flush to ensure latest validation state
    flush();
    
    if (!state.valid.get()) {
      dispatchEvent('validation-failed', { errors: state.errors.get() });
      
      // Scroll to first error
      afterFlush(() => {
        const firstErrorField = $('.field-container.error').first().el();
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      return;
    }
    
    // Show submitting state
    state.submitting.set(true);
    
    try {
      if (settings.onSubmit) {
        await settings.onSubmit(state.values.get());
      }
      
      dispatchEvent('submit-success', { values: state.values.get() });
    } catch (error) {
      dispatchEvent('submit-error', { error });
    } finally {
      state.submitting.set(false);
    }
  },
  
  resetForm() {
    // Reset to initial values from schema
    const initialValues = {};
    (settings.schema || []).forEach(field => {
      initialValues[field.name] = field.defaultValue || '';
    });
    state.values.set(initialValues);
    state.touched.set({});
  },
  
  // Render helpers
  getFormClasses() {
    return {
      submitting: state.submitting.get(),
      invalid: !state.valid.get()
    };
  },
  
  getFieldClasses(field) {
    const name = field.name;
    return {
      error: self.shouldShowError(name),
      required: field.required,
      touched: self.isFieldTouched(name)
    };
  }
});

const events = {

  'submit form'({ event, self }) {
    event.preventDefault();
    self.submitForm();
  },

  'click .reset'({ self }) {
    self.resetForm();
  },
  
  'input input, textarea'({ target, self, data }) {
    self.setFieldValue(data.name, target.value);
  },
  
  'change select'({ target, self, data }) {
    self.setFieldValue(data.name, target.value);
  },
};

// Define component
defineComponent({
  tagName: 'dynamic-form',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events
});
