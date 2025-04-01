import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style'
import './RichTextEditor.css';

const RichTextEditor = ({ taskDescription, setTaskDescription}) => {
  const colorOptions = [
    '#e81416', '#ffa500', '#faeb36', '#79c314', '#487de7', '#4b369d', '#70369d',
    '#f47474', '#ffd580', '#fff77e','#b2e687', '#8fb9f9', '#9a86cc', '#b27fc6'
  ];
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [color, setColor] = useState('rgba(255, 255, 0, 0)');
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        Blockquote: false,
        Codeblock: false,
        HardBreak: false,
        Horizontal: false,
        Code: false,
      }),
      Highlight.extend({
        addOptions() {
          return {
            multicolor: true,
            defaultColor: '#FFFF00', 
            HTMLAttributes: {},
          };
        },
      }),
      Underline, 
      TextStyle,
    ],
    content: taskDescription,
    onUpdate: ({ editor }) => {
      setTaskDescription(editor.getHTML());
      const headingLevel = editor.getAttributes('heading')?.level || 0;
      setCurrentHeading(headingLevel); 
    },
  });

  useEffect(() => {
    if (editor && taskDescription !== editor.getHTML()) {
      editor.commands.setContent(taskDescription || 'Add a description here...');
    }

  }, [taskDescription, editor]);

  // Listens if mouse is clicked outside of color sidebar elements.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of the color picker
      const colorPicker = document.querySelector('.highlight-picker-sidebar');
      if (colorPicker && !colorPicker.contains(event.target)) {
        setShowColorPicker(false); // Close the color picker if clicked outside
      }
      const formControl = document.querySelector('.form-control form-control-color-sidebar');
      if(formControl && !formControl.contains(event.target)){
        setShowColorPicker(false);
      }

      const dropdownMenu = document.querySelector('#editor-toolbar .dropdown .dropdown-menu');
      if (dropdownMenu && !dropdownMenu.contains(event.target)) {
        setShowHeader(false); // Close the dropdown if clicked outside
      }
  
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHeadingChange = (number) =>{
    setCurrentHeading(number)
    if(number == 0){
      editor.chain().focus().setParagraph().run()
    }
    else{
      editor.chain().focus().toggleHeading({ level: number }).run()
    }

    setShowHeader(!showHeader)
  }

  // Used to get color for bar indicator
  const getColorAtClick = (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'MARK') {
      const backgroundColor = getComputedStyle(clickedElement).backgroundColor; // Get the background color
      setColor(backgroundColor)
    }
    else{
      setColor(('rgba(255, 255, 0, 0)'))
    }
  };
  useEffect(() => {
    const editorContent = document.querySelector('#editor-textbox');
    if (editorContent) {
      editorContent.addEventListener('click', getColorAtClick);
    }

    return () => {
      if (editorContent) {
        editorContent.removeEventListener('click', getColorAtClick);
      }
    };
  }, [editor]);

  // Handles color changes
  const handleColorChange = (newColor, src) => {
    setColor(newColor);
    editor.chain().focus().setHighlight({ color: newColor }).run();
    if (src == 1)
      setShowColorPicker(!showColorPicker)
  };

  // Checks if button(s) are toggled:
  const isBoldActive = editor?.isActive('bold');
  const isItalicActive = editor?.isActive('italic');
  const isUnderlineActive = editor?.isActive('underline');
  const isBulletActive = editor?.isActive('bulletList');
  const isOrderedActive = editor?.isActive('orderedList');
  const isStrikeActive = editor?.isActive('strike');
    // Clears textbox
    const handleFocus = () => {
      if (editor && editor.getText() === 'Add a description here...') {
        editor.commands.setContent(''); 
      }
    };

    return (
      <div className="task-details-body">
        <div id="editor-wrapper">
          {/* Toolbar */}
          <div id="editor-toolbar">
            {/* Undo Button */}
            <button 
            className={`toolbar-btn `}
            onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
            type="button">
            <i className="fas fa-undo"></i>
            </button>

            {/* Redo Button */}
            <button 
            className={`toolbar-btn `}
            onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
            type="button">
            <i className="fas fa-redo"></i>
            </button>

            {/* Headings Dropdown */}
            <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setShowHeader(!showHeader)}
              type="button"
            >
              {currentHeading === 0 ? 'Normal Text' : `Heading ${currentHeading}`}
            </button>
            {showHeader && (
              <div className="dropdown-menu">
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(0)}
                  type="button"
                >
                  Normal Text
                </button>
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(1)}
                  type="button"
                >
                  Heading 1
                </button>
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(2)}
                  type="button"
                >
                  Heading 2
                </button>
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(3)}
                  type="button"
                >
                  Heading 3
                </button>
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(4)}
                  type="button"
                >
                  Heading 4
                </button>
                <button
                  className="header-item"
                  onClick={() => handleHeadingChange(5)}
                  type="button"
                >
                  Heading 5
                </button>
              </div>
            )}
          </div>

            {/* Bold Button */}
            <button
              className={`toolbar-btn ${isBoldActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              type="button"
            >
              <div>
              <strong>B</strong>
              </div>

            </button>

            {/* Italics Button */}
            <button
              className={`toolbar-btn ${isItalicActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              type="button"
            >
              <em>I</em>
            </button>

            {/* Underline Button */}
            <button
              className={`toolbar-btn ${isUnderlineActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              type="button"
            >
              <u>U</u>
            </button>

            {/* Highlight Button */}
            <div>
            <button
              className={`toolbar-btn`}
              onClick={() => setShowColorPicker(!showColorPicker)}
              type="button"
            >
            <i className="fas fa-eye-dropper"></i>
              {/* Color Indicator */}
              <div 
              id="color-indicator-bar" 
              style={{
                backgroundColor: color === 'rgba(255, 255, 0, 0)' ? 'transparent' : color, 
                border: color === 'rgba(255, 255, 0, 0)' ? '2px solid #ccc' : 'none'
              }}
            />
            </button>
            
          {showColorPicker && (
          <div className="highlight-picker-sidebar">
          <div
            className="no-highlight"
            onClick={() => handleColorChange('rgba(255, 255, 0, 0)', 1)}
          >
            None
          </div>
          {colorOptions.map((colorOption) => (
            <div key={colorOption} className="highlight-option-sidebar" style={{ backgroundColor: colorOption }} onClick={() => handleColorChange(colorOption, 1)} />
          ))}
          {/* Commeting out to fix bugs later <div className="highlight-picker-wrapper">
          <i className="fas fa-eye-dropper"></i>
            <input type="color" className="form-control form-control-color-sidebar-RTE" value={color} title="Choose a color" onChange={(e) => handleColorChange(e.target.value, 2)} />
          </div>*/}
        </div> 
          )}
            </div>
            
            {/* Strikethrough Button */}
            <button
              className={`toolbar-btn ${isStrikeActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              type="button"
            >
              <s>A</s>
            </button>

            {/* BulletList Button */}
            <button
              className={`toolbar-btn ${isBulletActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              type="button"
            >
            <i className="fas fa-list-ul"></i> 
            </button>

            {/* OrderedList Button */}
            <button
              className={`toolbar-btn ${isOrderedActive ? 'active' : ''}`}
              onClick={() => editor.chain().toggleOrderedList().run()}
              type="button"
            >
            <i className="fas fa-list-ol"></i>
            </button>

          </div>
            
          <EditorContent id="editor-textbox" 
          editor={editor}
          onFocus={handleFocus} 
          />
        </div>
      </div>
    );
  };

  export default RichTextEditor;