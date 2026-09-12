sed -i 's#return text.split(/\\n|/).map((line, idx, arr) => (#return text.split(/\\\\n|\\n/).map((line, idx, arr) => (#g' src/components/CVDocument.tsx
