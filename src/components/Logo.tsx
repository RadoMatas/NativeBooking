export default function Logo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const height = size === 'large' ? '60px' : '36px'
  return (
    <img
      src="/lgo.jpg"
      alt="Apex Clinic Logo"
      style={{ height, width: 'auto', display: 'block', borderRadius: '8px' }}
    />
  )
}
