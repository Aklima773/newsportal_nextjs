 import React, { Suspense } from 'react'
import NewsSkeleton from '../news/NewsSkeleton'
import PremiumNewsList from '../news/premiumNewsList'
 
 const PremiumPage = () => {
   return (
     <div className='mx-auto max-w-7xl space-y-6 lg:px-8'>

        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>

            <div>
                <h1 className='text-2xl font-semibold'>
                    Premium News
                </h1>
                <p className='text-sm text-muted-foreground'>Exclusive Stories for our Subscribers</p>
            </div>

        </div>

        <Suspense fallback={<NewsSkeleton/>}>
        <PremiumNewsList/>
        </Suspense>
       
     </div>
   )
 }
 
 export default PremiumPage
 