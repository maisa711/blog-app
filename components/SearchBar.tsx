import { InputField } from "./Helpers"



const SearchBar = ({searchQuery,handleSearchChange}:any) => {
  return (
    <form className="flex w-full justify-center ">
        <InputField
          type="text"
          placeholder="Search for a product..."
          value={searchQuery}
          onChange={handleSearchChange}
          classNameCont="w-full"
          className="rounded-full bg-card-bg backdrop-blur-md w-full h-10 px-4 text-main-text shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        />
      </form>
  )
}

export default SearchBar