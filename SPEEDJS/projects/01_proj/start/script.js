function updateClock (){
    
    const timeElement = document.getElementById('time')
    // console.log(timeElement)
    const dateElement = document.getElementById('date')

    const now = new Date()
    const hours = now.getHours() % 12 || 12
    console.log(hours)

    // const time = 1 || 12
    // console.log(time)
    // const minutes = now.getMinutes()
    //console.log(minutes) //Problem when 1,3,4,till 9... in the screen i t should be 02,03
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    // console.log(minutes)

    //minutes < 10 ? `0${minutes}` : `${minutes}` // Another logic

    const ampm = now.getHours() >= 12 ? "PM" : "AM"

    timeElement.textContent = `${hours}:${minutes}:${seconds}:${ampm}`

}

setInterval(updateClock, 1000)

