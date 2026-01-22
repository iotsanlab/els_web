"use client"


import { SvgIcons } from "../../assets/icons/SvgIcons";
import { cn } from "../../utils/utils";
import DataCard1 from "../DataCard";



const EcommerceStats = () => {
  const data = [
    {
      text: "Total Sales",
      total: "42,750.98",
      color: "primary",
      icon: <SvgIcons iconName="Profile"/>
    },
    {
      text: "Today Orders",
      total: "536,23,3",
      color: "warning",
      icon: <SvgIcons iconName="Profile"/>
    },
    {
      text: "Completed Orders",
      total: "234,1",
      color: "success",
      icon: <SvgIcons iconName="Profile"/>
    },
    {
      text: "Pending Orders",
      total: "332,34",
      color: "destructive",
      icon: <SvgIcons iconName="Profile"/>
    },
  ];
  return (
    <>
      {data.map((item, index) => (
        <div
          key={`reports-state-${index}`}
          className={cn(
            "flex flex-col gap-1.5 p-4 rounded-[10px] overflow-hidden bg-primary/10  items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden ",
            {
              "bg-primary/40  dark:bg-primary/70": item.color === "primary",
              "bg-orange-50 dark:bg-orange-500": item.color === "warning",
              "bg-green-50 dark:bg-green-500": item.color === "success",
              "bg-red-50 dark:bg-red-500 ": item.color === "destructive",
            }
          )}
        >
         
        <DataCard1 title={"emin"} value={40} />
      
         
        </div>
      ))}
    </>
  );
};

export default EcommerceStats;