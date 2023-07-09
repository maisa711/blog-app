import Feed from '@components/Feed';

export default function ProfilePage({ params: { id }}:any) {
  return (
    <>
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 justify-center ">
      <Feed userid={id}/>
    </div>
    </>
    
  )
}
