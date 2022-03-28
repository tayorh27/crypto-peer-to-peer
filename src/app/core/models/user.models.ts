export interface CryptoUser {
    id:string
    name: string
    phone_number: string
    email:string
    image:string
    user_type?:string
    user_role_type?:string//owner, staff
    email_verified?:boolean
    blocked:boolean
    role:string
    access_levels:string
    created_date?:string
    modified_date:string
    timestamp?:any
    msgID?:any
}