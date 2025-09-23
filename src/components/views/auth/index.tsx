import Router from "next/router"

const RegisterView = () => {

    const handleSubmit =  () => {
        Router.push("/dashboard")
    }

    return (
        <div>
            <h1>Register</h1>
            <form action="">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" />
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default RegisterView