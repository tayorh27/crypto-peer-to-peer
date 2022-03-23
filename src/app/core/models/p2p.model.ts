export interface P2P {
    id: string
    order_id: string
    order_type: string
    order_asset: string
    listed_as: string
    total_amount: number
    order_price: number
    order_limit_min: number
    order_limit_max: number
    status: string
    currency: string
    country: string
    is_user_ordering: boolean
    timestamp: any
    created_date: string
    created_by: CreatedBy
}

export interface CreatedBy {
    user_id: string
    email: string
    name: string
    msgId: any
    image: string
    number: string
}