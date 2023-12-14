import React, { Component } from 'react'

class ProductRow extends Component {
    constructor(props) {
        super(props)
        this.destroy = this.destroy.bind(this)
        this.update = this.update.bind(this)
    }

    destroy() {                
        this.props.onDestroy(this.props.product.id);
    }

    update(){
        this.props.onEdit(this.props.product)
    }

    render () {
        return (
            <tr>
                <td>{this.props.product.product.productid}</td>
                <td>{this.props.product.product.name}</td>
                <td>{this.props.product.product.category}</td>
                <td>{this.props.product.product.price}</td>
                <td>{this.props.product.product.instock ? "Yes" : "No"}</td>
                <td className="text-right"><button onClick={this.update} className="btn btn-primary">Update</button></td>
                <td className="text-right"><button onClick={this.destroy} className="btn btn-primary">Delete</button></td>
            </tr>
        )
    }
}

export default ProductRow