export const DetailsVarification = (email, password) => {
    // Improved email validation regex
    const emailIsValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    // Password regex: at least 8 characters, one letter, one digit, one special character
    const passwIsValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

    // Return specific error messages
    if (!emailIsValid) return "Email ID is incorrect";
    if (!passwIsValid) return "Password is incorrect";
    
    // Return null if both are valid
    return null;
};

export default DetailsVarification;
