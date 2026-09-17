import re

file_path = 'src/components/PreviewPanel.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add a ResizeObserver to calculate the fit scale
new_scale_logic = """
  const [fitScale, setFitScale] = useState<number>(1);
  const CV_WIDTH = 794; // Fixed A4 width

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateScale = () => {
      if (containerRef.current) {
        // Add some padding (e.g., 32px total) to the available width
        const availableWidth = containerRef.current.clientWidth - 32;
        const newScale = Math.min(availableWidth / CV_WIDTH, 1);
        setFitScale(newScale);
      }
    };

    calculateScale();

    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  const effectiveZoom = zoomMode === 'fit' ? fitScale : customZoom;
"""

content = re.sub(r'  const \[zoomMode, setZoomMode\] = useState<\'fit\' \| \'custom\'>\(\'fit\'\);', r"  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');\n" + new_scale_logic, content)

# Change style to use effectiveZoom
content = content.replace("style={customZoom !== 1 ? { transform: `scale(${customZoom})` } : undefined}", 
                          "style={{ transform: `scale(${effectiveZoom})` }}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
