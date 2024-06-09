export function normalizePort(fallbackPort: number = 8080){
    console.log('Checking enviromental variables for PORT...');
    const PORT = parseInt(process.env.PORT as string);
    if(isNaN(PORT)){
        console.log('Unable to use environmental variables...');
        console.log(`Using fallback PORT ${fallbackPort}...`);
        return fallbackPort;
    }
    return PORT;
    
}