export default{
    aside:{
        items:[
            {
                path:'/dashboard',
                name:'Dashboard',
                icon:'fa fa-columns'
            },
            {
                path:'/dashboard/user',
                name:'User Managment',
                icon:'fa fa-users'
            },
            {
                groupName:"Product Management",
                icon:'fa fa-columns',
                group:[
                    {
                        name:'Brand',
                        path:'/dashboard/brand'
                    },{
                        name:'Type',
                        path:'/dashboard/type'
                    },
                    {
                        name:'Products',
                        path:'/dashboard/product'
                    },{
                        name:"Bulk Upload Image",
                        path:'/dashboard/productImage'
                    },{
                        name:'Category',
                        path:'/dashboard/category'
                    },{
                        name:'Sub Category',
                        path:'/dashboard/subCategory'
                    },

                ]
            },
            {
                groupName:"Report",
                icon:'fa fa-columns',
                group:[{
                    name:'Brand Report',
                    path:'/dashboard/brandReport'
                },{
                    name:'Category Report',
                    path:'/dashboard/categoryReport'
                },{
                    name:'Sub-Category Report',
                    path:'/dashboard/subCategoryReport'
                },]
            }
        ]
    }
}