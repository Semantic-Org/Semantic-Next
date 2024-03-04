
export function renderMenu(menu) {
  let html = '';

  menu.forEach(section => {
    html += `<div class="title">${section.name}</div>\n`;
    if (section.pages.some(page => page.pages)) {
      // Has subsections
      section.pages.forEach(subsection => {
        html += `<div class="title">${subsection.name}</div>\n<div class="menu">\n`;
        subsection.pages.forEach(page => {
          html += `<a class="item" href="${page.url}">${page.name}</a>\n`;
        });
        html += `</div>\n`; // Close menu
      });
    } else {
      // No subsections, direct pages
      html += `<div class="content">\n<div class="menu">\n`;
      section.pages.forEach(page => {
        html += `<a class="item" href="${page.url}">${page.name}</a>\n`;
      });
      html += `</div>\n</div>\n`; // Close menu and content
    }
  });
  return html;
};
