import Table from "../../ui/Table";




const TableAds = ({ads,handleDelete,openModal}:any) => {
  return (
     <div >
       <Table data={ads}  openModal={openModal} handleDelete={handleDelete}/>
        </div>
  )
}

export default TableAds