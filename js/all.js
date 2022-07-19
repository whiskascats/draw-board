$(document).ready(function() {
    let canvas = document.getElementById("draw-board");
    let ctx = canvas.getContext("2d");
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    let canvasWidth = $('body').outerWidth(true)
    let canvasHeight = $('body').outerHeight(true)
    let step = 0
    let history = []
    let color = ['#98ffcd', '#00cc99', '#01936f']
    let isPen = true
    history[0] = canvas.toDataURL()
    canvas.width = pageWidth;
    canvas.height = pageHeight - 150;
    
    // ctx.beginPath()
    // ctx.moveTo(20, 20)
    // ctx.lineTo(150, 100)
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 5
    // ctx.stroke()
    console.log('step目前畫面索引值'+step, 'history紀錄長度'+history.length, history)
    let push = function() {
        step++
        if(step <= history.length-1){
            history.length = step
        }
        history.push(canvas.toDataURL())
        if(history.length > 1) {
            $('.undo div').removeClass('disable')
        }
        if(step < history.length-1){
            $('.redo div').removeClass('disable')
        }else{
            $('.redo div').addClass('disable')
        }
        console.log('step目前畫面索引值'+step, 'history紀錄長度'+history.length, history)
        // console.log(step, history.length)
        // alert(100)
    }

    let undo = (() => {
        let lastDraw = new Image()
        if(step > 0){
            step--
        }
        lastDraw.src = history[step]
        lastDraw.onload = function() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight) //清除畫面
            ctx.drawImage(lastDraw, 0, 0) //放上圖片
        }
        if (step == 0) {
            $('.undo div').addClass('disable')
        }
        if (step < history.length - 1) {
            $('.redo div').removeClass('disable')
        }
        console.log('step目前畫面索引值'+step, 'history紀錄長度'+history.length, history)
    })
    let redo = function() {
        let lastDraw = new Image()

        if(step < history.length-1){
            step++
        }
        lastDraw.src = history[step]
        lastDraw.onload = function() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            ctx.drawImage(lastDraw, 0, 0)
        }
        if (step > 0) {
            $('.undo div').removeClass('disable')
        }
        if (step == history.length - 1) {
            $('.redo div').addClass('disable')
        }
        console.log('step目前畫面索引值'+step, 'history紀錄長度'+history.length, history)
    }
    let clearAll = (() => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        push()
    })
    let save = (() => {
        let link = canvas.toDataURL('image/png')
        
        $(".save").attr('href', link)
        $(".save").attr('download', 'canvas.png')
        console.log(this, link)
    })
    $(".undo").on("click", undo)
    $(".redo").on("click", redo)
    $(".clear").on("click",clearAll)
    $(".save").on("click", save)
    let lastPointX, lastPointY
    let clickDown = ((e) => {
        lastPointX = e.offsetX
        lastPointY = e.offsetY    
        $("#draw-board").on('mousemove', moveDown)
        $("#draw-board").on('mouseup', clickUp)
    })
    
    let moveDown = ((e) => {
        let newPointX = e.offsetX
        let newPointY = e.offsetY
        ctx.beginPath()
        ctx.moveTo(lastPointX, lastPointY)
        ctx.lineTo(newPointX, newPointY)
        ctx.stroke()
        lastPointX = newPointX
        lastPointY = newPointY
    })
    
    let clickUp = ((e) => {
        $("#draw-board").off('mousemove', moveDown)
        $("#draw-board").off('mouseup', clickUp)
        push()
    })
    $("#draw-board").on('mousedown', clickDown)
    
    
    let penSize = (() => {
        // console.log($(".input-size")[0].value)
        ctx.lineWidth = $(".input-size")[0].value
    })
    $(".input-size").on('blur', penSize)
    
    let setColor = (() => {
        let str = `COLOR:  <a href="javascript:;" class="color mx-1" style="border: solid 1px #000; background-color: #fff;"></a>
        <a href="javascript:;" class="color mx-1" style="background-color: #000;"></a>`
        color.forEach((item) => {
            str += `
                <a href="javascript:;" class="color mx-1" style="background-color: ${item};">
                </a>
            `
        })
        $(".color-sel").html(str)
    })
    setColor()
    let getColor = ((e) => {
        // console.log(e.target.style.backgroundColor)
        ctx.strokeStyle = e.target.style.backgroundColor
    })
    let colorClick = (() => {
        $(".color").each((item, index) => {
            $(this).on("click", getColor)
        })
    })
    colorClick()


    let colorPicker = ((e) => {
        color.splice(0,1)
        color.push(e.target.value)
        setColor()
    })
    $("#color-pick").on("change", colorPicker)
    let penOrEraser = (() => {
        let cacheColor = ctx.strokeStyle
        isPen = !isPen
        if(isPen){
            $(".fa-eraser").addClass('d-block')
            $(".fa-pen").removeClass('d-block')
            ctx.strokeStyle = cacheColor
        }else{
            $(".fa-eraser").removeClass('d-block')
            $(".fa-pen").addClass('d-block')
            ctx.strokeStyle = '#e8e8e8'
        }
    })
    $(".palette .peneraser").on('click', penOrEraser)
})

