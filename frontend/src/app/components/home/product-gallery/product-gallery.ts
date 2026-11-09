import { Component } from '@angular/core';
import { Sidenavigation } from '../sidenavigation/sidenavigation';
import { Products } from '../../products/products';
import { ProductsStoreItem } from '../services/product/products.storeItem';

@Component({
  selector: 'app-product-gallery',
  imports: [Sidenavigation,Products],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.css'
})
export class ProductGallery {

  constructor( private productsStoreItemn:ProductsStoreItem){}

      onSubCategoryClick(subcategoryid:number){
      this.productsStoreItemn.loadProducts({subcategoryid:subcategoryid})
    }
}
