export default function getRandomColor(){
    const temp = [];
    for(let i = 0; i < 3; i++){
        temp.push(Math.floor(Math.random() * 255));
    }
    return temp.toString();
}