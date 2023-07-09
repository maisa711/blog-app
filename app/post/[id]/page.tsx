import ShowPost from "@components/ShowPost"

export default function Page({ params: { id }}:any) {
    
    return(
        <>
            <ShowPost id={id} />
        </>
        
    )
}