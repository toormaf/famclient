import { useState } from 'react';
import OutsideClickHandler from './OutsideClickHandler';

export function OutsideClickExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div style={{ padding: '40px' }}>
      <h2>OutsideClickHandler Examples</h2>

      {/* Example 1: Simple Alert */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 1: Simple Alert</h3>
        <OutsideClickHandler
          onOutsideClick={() => {
            alert('You clicked outside of this component!!!');
          }}
        >
          <div
            style={{
              padding: '20px',
              border: '2px solid #1890ff',
              borderRadius: '8px',
              backgroundColor: '#e6f7ff',
              maxWidth: '400px',
            }}
          >
            Click outside this box to see an alert!
          </div>
        </OutsideClickHandler>
      </div>

      {/* Example 2: Dropdown Menu */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 2: Dropdown Menu</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            backgroundColor: isOpen ? '#1890ff' : '#fff',
            color: isOpen ? '#fff' : '#000',
          }}
        >
          {isOpen ? 'Close' : 'Open'} Menu
        </button>

        {isOpen && (
          <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
            <div
              style={{
                marginTop: '8px',
                padding: '8px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                maxWidth: '200px',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => alert('Option 1 clicked')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Option 1
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => alert('Option 2 clicked')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Option 2
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => alert('Option 3 clicked')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Option 3
              </div>
            </div>
          </OutsideClickHandler>
        )}
      </div>

      {/* Example 3: Counter with Reset on Outside Click */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 3: Counter (Resets on Outside Click)</h3>
        <OutsideClickHandler
          onOutsideClick={() => {
            if (clickCount > 0) {
              setClickCount(0);
            }
          }}
        >
          <div
            style={{
              padding: '20px',
              border: '2px solid #52c41a',
              borderRadius: '8px',
              backgroundColor: '#f6ffed',
              maxWidth: '300px',
            }}
          >
            <p style={{ margin: '0 0 10px 0' }}>Clicks: {clickCount}</p>
            <button
              onClick={() => setClickCount(clickCount + 1)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                border: '1px solid #52c41a',
                borderRadius: '4px',
                backgroundColor: '#52c41a',
                color: '#fff',
              }}
            >
              Increment
            </button>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
              Click outside to reset counter
            </p>
          </div>
        </OutsideClickHandler>
      </div>

      {/* Example 4: Disabled State */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 4: Disabled Outside Click Handler</h3>
        <OutsideClickHandler
          onOutsideClick={() => {
            alert('This should not appear!');
          }}
          disabled={true}
        >
          <div
            style={{
              padding: '20px',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              maxWidth: '400px',
            }}
          >
            Outside click detection is disabled for this box.
            <br />
            Click anywhere - no alert will appear!
          </div>
        </OutsideClickHandler>
      </div>

      {/* Example 5: Modal-like Behavior */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 5: Modal-like Component</h3>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: '1px solid #1890ff',
              borderRadius: '4px',
              backgroundColor: '#1890ff',
              color: '#fff',
            }}
          >
            Open Modal
          </button>
        )}

        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
              <div
                style={{
                  padding: '40px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  maxWidth: '500px',
                }}
              >
                <h2 style={{ marginTop: 0 }}>Modal Title</h2>
                <p>This is a modal-like component. Click outside to close.</p>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    marginTop: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                  }}
                >
                  Close
                </button>
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}
      >
        <h3>Usage</h3>
        <pre style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import OutsideClickHandler from '@/utils/OutsideClickHandler';

<OutsideClickHandler
  onOutsideClick={() => {
    alert('Clicked outside!');
  }}
  disabled={false}  // Optional
  className="custom-class"  // Optional
  style={{ padding: '20px' }}  // Optional
>
  <div>Your content here</div>
</OutsideClickHandler>`}
        </pre>
      </div>
    </div>
  );
}

export default OutsideClickExample;
