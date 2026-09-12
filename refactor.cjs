const fs = require('fs');
let code = fs.readFileSync('src/components/CVDocument.tsx', 'utf8');

// Rename CVDocument to CVDocumentInner
code = code.replace(
  "export const CVDocument: React.FC<CVDocumentProps> = ({",
  "const CVDocumentInner: React.FC<CVDocumentProps> = ({"
);

// Add the distinct wrapper components and the new CVDocument at the bottom
const bottomCode = `
// =========================================================================
// DISTINCT TEMPLATE WRAPPERS (Isolates CSS/DOM state during transitions)
// =========================================================================

const ModernTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const ExecutiveTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const CreativeTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

const MinimalistTemplateWrapper: React.FC<CVDocumentProps> = (props) => {
  return <CVDocumentInner {...props} />;
};

export const CVDocument: React.FC<CVDocumentProps> = (props) => {
  const templateId = props.data.theme?.template || props.data.theme?.layoutStyle || 'modern';

  // Mount a completely distinct React Component based on the template.
  // This prevents React from reusing DOM nodes between structurally different templates,
  // ensuring CSS grids, flexboxes, and specific styles do not collapse or inherit.
  switch (templateId) {
    case 'executive':
      return <ExecutiveTemplateWrapper {...props} />;
    case 'creative':
      return <CreativeTemplateWrapper {...props} />;
    case 'minimalist':
      return <MinimalistTemplateWrapper {...props} />;
    case 'modern':
    default:
      return <ModernTemplateWrapper {...props} />;
  }
};
`;

if (!code.includes("export const CVDocument: React.FC<CVDocumentProps> = (props)")) {
  fs.writeFileSync('src/components/CVDocument.tsx', code + bottomCode);
  console.log("Refactoring applied successfully!");
} else {
  console.log("Already refactored.");
}
