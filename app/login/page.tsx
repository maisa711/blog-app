import UserForm from "@components/UserForm"

const LoginPage = () => {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 justify-center">
      <UserForm UserAuth={true}/>
    </div>
  )
}

export default LoginPage