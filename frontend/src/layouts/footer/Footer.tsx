const Footer = () => {
  return (
    <section className='w-full [padding-left:_clamp(1rem,2vw,calc(24rem_/_16))]  [padding-right:_clamp(1rem,2vw,calc(24rem_/_16))]  py-7  bg-gradient-to-br from-purple-600 to-blue-500 flex-col justify-start items-start gap-2 inline-flex  '>
      <div className='self-stretch  h-full justify-start items-start gap-12 inline-flex flex-col lg:flex-row'>
        <div className='self-stretch flex-col justify-start items-start  inline-flex lg: gap-36'>
          <div className="text-white text-xs font-light ">
            © Proof of concept Inc.{' '}
          </div>
        </div>
        <div className=' w-full self-stretch justify-start items-start gap-16 flex lg:w-96   '>
          <div className='flex-col justify-start items-start gap-2 inline-flex'>
            <div className="text-white text-sm font-bold ">
              Your Account
            </div>
            <div className="text-white text-sm font-normal ">
              Sign Up
            </div>
            <div className="text-white text-sm font-normal">
              Login
            </div>
            <div className="text-white text-sm font-normal ">
              Help
            </div>
          </div>
          <div className='flex-col justify-start items-start gap-2 inline-flex'>
            <div className="text-white text-sm font-bold ">
              About
            </div>
          </div>
          <div className='flex-col justify-start items-start gap-2 inline-flex'>
            <div className="text-white text-sm font-bold ">
              Search
            </div>
          </div>
        </div>
        <div className='grow  h-[max-content] relative' />
        <div className='w-40 self-stretch justify-start items-start gap-4 flex'>
          {/* <div className='px-2 justify-start items-start gap-2 flex'>
            
          </div> */}
          <div className='w-[1px] h-full border border-white hidden lg:block'></div>
          <div className='self-stretch flex-col justify-start items-start gap-3 inline-flex'>
            <div className='justify-start items-start gap-1.5 inline-flex'>
              <div className='w-6 h-6 relative'>
                <div className='w-6 h-6 left-0 top-0 absolute bg-white rounded-full' />
                <div className='w-3.5 h-3 left-[5px] top-[6px] absolute' />
              </div>
              <div className='w-6 h-6 relative'>
                <div className='w-6 h-6 left-0 top-0 absolute bg-white rounded-full' />
                <div className='w-3.5 h-4 left-[5px] top-[4px] absolute' />
              </div>
              <div className='w-6 h-6 relative'>
                <div className='w-6 h-6 left-0 top-0 absolute bg-white rounded-full' />
                <div className='w-4 h-4 left-[4px] top-[4px] absolute' />
              </div>
            </div>
            <div className='flex-col justify-start items-start gap-3 flex'>
              <div className="w-32 h-4 text-white text-xs font-light ">
                Terms of Service
              </div>
              <div className="w-32 h-4 text-white text-xs font-light ">
                Terms of Use
              </div>
              <div className="w-32 h-4 text-white text-xs font-light ">
                Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
