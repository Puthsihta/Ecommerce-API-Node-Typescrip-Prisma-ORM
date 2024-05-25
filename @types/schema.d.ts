declare namespace IShop {
  interface open_time {
    start_time: string;
    end_time: string;
  }
  interface freight {
    free: string;
    lable: string;
    free_delivery: boolean;
    delivery_time: string;
    remark: string;
    est_free_delivery: number;
  }
}
