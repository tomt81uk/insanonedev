export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#335784]">
        {children}
      </body>
    </html>
  );
}
