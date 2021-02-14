export const carouselCard = (position, idx, noOfSlidePerScreen,items) => {
    const length=items.length
    const item = {
        styles: {
            transform: `translateX(${(position * 100)}%)`,
            width:`calc(100% / ${(length * noOfSlidePerScreen) / noOfSlidePerScreen})`
        },
        data: items[idx]
    }

    switch (position) {
        case length - 1:
            item.styles = { ...item.styles,opacity:0,transform:'translateX(-100%) scaleY(10)' }
        case length + 1:
            item.styles = { ...item.styles }
            break
        case length:
            item.styles = { ...item.styles, opacity: 0,transform:'translateX(200%)' }
            break
        default:
            // item.styles = { ...item.styles, opacity: 0 }
            break
    }
    return item
}



        // const itemSqrt=Math.sqrt(length)
        // const itemsSqrtBeforeDecimal=itemSqrt.toString().split('.')[0]
        // const itemsOperator= length % 2
        // const slideOperator=noOfSlidePerScreen % 2
        // const slideScreen=
        //     (length > 1 && length !== noOfSlidePerScreen) ? 
        //         itemsOperator === 1 ?
        //             slideOperator === 1 ? 0 : 100 / noOfSlidePerScreen
        //         : slideOperator === 1 ?
        //             50
        //             : 0
        //     : 0