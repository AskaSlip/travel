import Link from 'next/link';

const NavigationComponent = () => {
  return (
      <>
        <Link href={'/'}>home</Link>
        <br/>
        <Link href={'/my-cabinet'}>Cabinet</Link>
        <br/>
        <Link href={'/statistic'}>Statistic</Link>
        <br/>
        <Link href={'/create-trip'}>create trip</Link>
        <br/>
        <Link href={'/trips'}>my trips</Link>
        <br/>
        <Link href={'/inspire'}>Inspire yourself</Link>
        <br/>
        <Link href={'/memories'}>Memories</Link>
        <br/>
        <Link href={'/create-memory'}>Create memory</Link>
    </>
  );
}
export default NavigationComponent;