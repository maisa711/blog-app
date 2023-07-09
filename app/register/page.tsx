import UserForm from "@components/UserForm"

const RegisterPage = () => {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 justify-center">
      <UserForm UserAuth={false}/>
    </div>
  )
}

export default RegisterPage