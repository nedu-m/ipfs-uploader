// __mocks__/components/ui/button.js
export const Button = jest.fn().mockImplementation(({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
));
