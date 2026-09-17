import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add `generatedPdf` state.
state_pattern = r'const \[printStatus, setPrintStatus\] = useState<\{.*?\} \| null>\(null\);'
new_states = """const [printStatus, setPrintStatus] = useState<{
    show: boolean;
    isError?: boolean;
    message?: string;
  } | null>(null);

  const [generatedPdf, setGeneratedPdf] = useState<{ file: File; filename: string; objectUrl: string } | null>(null);"""

content = re.sub(state_pattern, new_states, content, flags=re.DOTALL)

# 2. Update the printStatus auto-dismiss to NOT dismiss if generatedPdf exists
dismiss_pattern = r'if \(printStatus\?\.show && !printStatus\.isError\) \{\s*const timer = window\.setTimeout\(\(\) => \{\s*setPrintStatus\(null\);\s*\}, 5000\);\s*return \(\) => window\.clearTimeout\(timer\);\s*\}'
new_dismiss = """if (printStatus?.show && !printStatus.isError && !generatedPdf) {
      const timer = window.setTimeout(() => {
        setPrintStatus(null);
      }, 5000);
      return () => window.clearTimeout(timer);
    }"""
content = re.sub(dismiss_pattern, new_dismiss, content, flags=re.DOTALL)

# 3. Modify `executeDownloadPdf` to set `generatedPdf` instead of directly calling `navigator.share`
execute_pattern = r'const pdfFile = new File\(\[pdfBlob\], filename, \{ type: \'application/pdf\' \}\);.*?(?=setPrintStatus\(\{)'
new_execute_logic = """const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdf({ file: pdfFile, filename, objectUrl });

      """
content = re.sub(execute_pattern, new_execute_logic, content, flags=re.DOTALL)

# Also update the message in the success setPrintStatus
success_msg_pattern = r'message: shared \? \'PDF processed successfully!\' : \'PDF downloaded successfully!\','
new_success_msg = "message: 'PDF generated successfully! Choose an action below:',"
content = re.sub(success_msg_pattern, new_success_msg, content)


# 4. Modify the printStatus UI to show "Share" and "Download" buttons if generatedPdf exists.
ui_pattern = r'\{\/\* Direct fallback trigger for iframe blocking \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\)\})'
new_ui = """{/* Direct fallback trigger for iframe blocking or Action buttons for generated PDF */}
            <div className="flex flex-col gap-2 pt-1 border-t border-black/10">
              
              {generatedPdf ? (
                <div className="flex flex-wrap items-center gap-2">
                  {navigator.canShare && navigator.canShare({ files: [generatedPdf.file] }) && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.share({
                            files: [generatedPdf.file],
                            title: generatedPdf.filename,
                          });
                          setPrintStatus(null);
                        } catch (err: any) {
                          if (err.name !== 'AbortError') console.error('Share error:', err);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{t.previewControls.share || 'Share PDF'}</span>
                    </button>
                  )}
                  <a
                    href={generatedPdf.objectUrl}
                    download={generatedPdf.filename}
                    onClick={() => setPrintStatus(null)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.previewControls.downloadPdf || 'Download'}</span>
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDirectFallback}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                    <span>{t.previewControls.openInNewTab}</span>
                  </button>
                  <span className="text-[11px] opacity-80 flex-1 leading-tight">
                    {t.previewControls.printIframeHelp}
                  </span>
                </div>
              )}
            </div>"""

content = re.sub(ui_pattern, new_ui, content, flags=re.DOTALL)

# Add missing Share2 icon to imports if it's not there
if 'Share2' not in content:
    content = content.replace('import { ', 'import { Share2, ', 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
