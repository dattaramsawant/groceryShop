import React from 'react'
import AdminTopBar from '../nav/AdminTopBar'
import ProductImageUpload from './ProductImageUpload'

export default function ProductBulkUploadImage() {
    return (
        <>
            <div className='dashboardMiddleContent'>
                <AdminTopBar
                    pageName="Product Bulk Upload Images"
                />
                
                <div className="dashboardPage withoutPagination">
                    <ProductImageUpload />
                </div>
            </div>
        </>
    )
}
