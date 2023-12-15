import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

const RESET_VALUES = { productid: '', category: '', price: '', name: '', instock:false}

class Products extends Component {
    constructor(props) {        
        super(props)        
        this.state = {
            filterText: '',
            products: {}, 
            currentProduct:{
                id:'',
                product:Object.assign({}, RESET_VALUES)
            }
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.updateDB = this.updateDB.bind(this) 
        this.handleSave = this.handleSave.bind(this)  
        this.handleUpdate = this.handleUpdate.bind(this)             
    }
    
    //Displays the products from database, if there are any, on mounting
    componentDidMount(){           
        fetch("http://localhost:3003/product/get/")
        .then(res => res.json())
        .then(
            (result) => {         
                this.setState({
                    filterText:'',
                    products:result,
                    currentProduct : { 
                        id : '',
                        product :  Object.assign({}, RESET_VALUES)                        
                    }
                });
            },
            (error) => {
                this.setState({
                    filterText:'',
                    currentProduct : {
                        id : '',
                        product :  Object.assign({}, RESET_VALUES)                        
                    },
                    error
                })
            }
        )
    }

    //Update DB using APIs declared in server.js based on the operation
    updateDB(product,operation){   
        let endpoint="";
        
        if(operation === 'insert')
            endpoint = 'http://localhost:3003/product/create/'
        else
            endpoint = 'http://localhost:3003/product/update/' + product.id
        
        var xhr = new XMLHttpRequest()
        xhr.open('POST',endpoint)
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.send(JSON.stringify(product));
        this.setState((prevState) => {            
            let products = prevState.products
            products[product.id] = product
            return { products }
        })
        this.setState({                    
            currentProduct : { 
                id : '',
                product :  Object.assign({}, RESET_VALUES)                                                
            }
        })
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleUpdate(product){        
        this.setState((prevState) => {
            prevState.currentProduct = product;
            return {product}            
        })        
    }
    
    handleSave(product) {          
        if (!product.id) {
            product.id = new Date().getTime()
            this.updateDB(product,'insert')            
        }
        else {
            this.updateDB(product, 'update')
        }                                
    }    

    handleDestroy(productId) {        
        fetch(`http://localhost:3003/product/delete/${productId}`)
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({                    
                    products:result,
                    currentProduct : { 
                        id : '',
                        product :  Object.assign({}, RESET_VALUES)                                                
                    }
                });
            },
            (error) => {
                this.setState({
                    filterText:'',
                    currentProduct : { 
                        id : '',
                        product :  Object.assign({}, RESET_VALUES)
                    },
                    error
                })
            }
        )        
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}
                    onEdit={this.handleUpdate}>
                </ProductTable>
                <ProductForm
                    onSave={this.handleSave} product={this.state.currentProduct}>
                </ProductForm>
            </div>
        )
    }
}

export default Products