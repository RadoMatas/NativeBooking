import logoImg from '../assets/LogoSanatorium.png'

export default function Logo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const height = size === 'large' ? '54px' : '32px'
  return (
    <img
      src={logoImg}
      alt="Sanatorium Logo"
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
