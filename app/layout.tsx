export const metadata = {
  title: 'Ancient Lens - Paleozoic Aquarium',
  description: 'Anomalocaris in your browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
