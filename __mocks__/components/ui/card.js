// __mocks__/components/ui/card.js
export const Card = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
export const CardHeader = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
export const CardTitle = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
export const CardDescription = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
export const CardContent = jest.fn().mockImplementation(({ children }) => <div>{children}</div>);
