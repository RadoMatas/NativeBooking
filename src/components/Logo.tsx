import { ContractorIcon } from './ui/Icons'

export default function Logo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const containerSize = size === 'large' ? '48px' : '36px'
  const iconSize = size === 'large' ? 24 : 18

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: containerSize,
        height: containerSize,
        borderRadius: size === 'large' ? '12px' : '9px',
        background: 'rgba(245, 158, 11, 0.15)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)',
        color: '#f59e0b',
      }}
    >
      <ContractorIcon size={iconSize} />
    </div>
  )
}
