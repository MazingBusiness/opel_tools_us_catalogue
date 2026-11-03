export default function Logo({ white = false, className = 'h-8' }) {
  return <img src={white ? '/brand/opel-logo-white.png' : '/brand/opel-logo.png'} alt="OPEL" className={`w-auto ${className}`} />
}
