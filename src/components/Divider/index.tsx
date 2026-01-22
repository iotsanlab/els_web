const Divider = ({children}: {children?: React.ReactNode}) => {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray2 dark:border-gray9" />
      </div>
      <div className="relative flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default Divider;
