export default function Logo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const height = size === 'large' ? '54px' : '32px'
  return (
    <img
      src="/LogoWhite.png"
      alt="Sanatorium Logo"
      style={{ height, width: 'auto', display: 'block', objectFit: 'contain' }}
    />
  )
}
