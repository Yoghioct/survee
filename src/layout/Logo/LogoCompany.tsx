import Link from 'next/link';
import logo from '../../../public/images/logo-company.svg';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

function LogoCompany({ width = 115, height = 50 }: LogoProps) {
  return (
    <div className="flex cursor-pointer items-center">
      <Link href={'/'} scroll={false}>
        <Image src={logo} alt="logo" width={width} height={height} />
      </Link>
    </div>
  );
}

export default LogoCompany;
