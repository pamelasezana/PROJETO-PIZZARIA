// criar uma funcao pra reduzir o codigo e nao ficar repetindo a mesma coisa toda hora//
const c = (el) =>  document.querySelector(el); //retorna apenas o item//
const cs = (el) =>  document.querySelectorAll(el); //retorna o array com itens que encontrou//
let modalQt = 1;
let cart = [];
let modalkey = 0;


//primeiro vamos listar as pizzas//

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//clonei os itens da class//
    //preencher as informaçoes de .pizza-item//

    c('.pizza-area').append(pizzaItem); //coloquei o item na tela//
    pizzaItem.setAttribute('data-key', index); //setei o atributo data-key com o index da pizza//



    //vamos add imagem//
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //vamos add o nome da pizza//
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    
    //vamos add desc da pizza//
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //vamos add o preço da pizza//
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$  ${item.sizes[0].price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$  ${item.sizes[0].price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$  ${item.sizes[0].price.toFixed(2)}`;

    //add evento de click na tag a //
    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
            //bloquar acao de recarregar tela//
            e.preventDefault();

            //pegar o item clicado//
            let key = e.target.closest('.pizza-item').getAttribute('data-key');
            let modalQt = 1;
            modalkey = key;

            //pegar o nome do item clicado//
            c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            //pegar a descricao do item clicado//
            c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            //pegar imagem do item clicado//
            c('.pizzaBig img').src = pizzaJson[key].img;
            //pegar precos do item clicado//
            c('.pizzaInfo--actualPrice').innerHTML = `R$  ${pizzaJson[key].sizes[2].price.toFixed(2)}`;
            c('.pizzaInfo--actualPrice').innerHTML = `R$  ${pizzaJson[key].sizes[2].price.toFixed(2)}`;
            
            
            //pegar tamanho do item clicado//
            cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex].size;
            
                

               
            });
            c('.pizzaInfo--qt').innerHTML = modalQt;
            //quantidade padrao que tem no modal//
           

            c('.pizzaWindowArea').style.opacity = 0;
            c('.pizzaWindowArea').style.display = 'flex';
            setTimeout(() => {
                c('.pizzaWindowArea').style.opacity = 1;

            },200);
            
    });


});


//eventos do modal//

//fechar modal e voltar ao padrao de pizza grande selecionada//

function closeModal(){
    modalQt = 1;
    

    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex ==2){
                size.classList.add('selected');
            }else{
               
    
                size.classList.remove('selected');
            }
        });
        c('.pizzaWindowArea').style.display = 'none';
    },500);
    
   

    

    
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal);
   
    
});



c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
   
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});


cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
   size.addEventListener('click', (e) => {

        c('.pizzaInfo--size.selected').classList.remove('selected');
       size.classList.add('selected');

       
        //pegar o preço do tamanho selecionado//
        c('.pizzaInfo--actualPrice').innerHTML = `R$  ${pizzaJson[modalkey].sizes[sizeIndex].price.toFixed(2)}`;
   });
   
});

//adicionar ao carrinho//

c('.pizzaInfo--addButton').addEventListener('click', () => {
    //qual a pizza?
    console.log("pizza:" + modalkey);
    //qual tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    console.log("tamanho:" + size);
    //quantidade?
    let qt = modalQt;
    console.log("qt:" + qt);

    let identifier = pizzaJson[modalkey].id + '@' + pizzaJson[modalkey].sizes[size].size;

    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });
    if (key > -1){
        cart[key].qt += modalQt;
    }
    else{
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size:size,
            qt:modalQt
    
    
        });
    }

     updateCart();
    
        
closeModal();


});
//abrir carrinho mobile//
c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0){
        c('aside').style.left = 0;
       
    }   
});
//fechar carrinho mobile//
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});
function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
   
    if (cart.length>0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        


    for (let i in cart ){
        let pizzaItem = pizzaJson.find((item) =>  item.id == cart[i].id);
       //colocando preco do subtotal, preco do item vezes quantidade de//
        subtotal += pizzaItem.sizes[cart[i].size].price * cart[i].qt;
        let cartItem = c('.models .cart--item').cloneNode(true);

        let PizzaSizeName;
        switch(cart[i].size){
            case 0:
                PizzaSizeName = 'P';
                break;
            case 1:
                PizzaSizeName = 'M';
                break;
            case 2:
                PizzaSizeName = 'G';
                break;
        }


        let pizzaName = `${pizzaItem.name} (${PizzaSizeName})`;
        cartItem.querySelector('img').src = pizzaItem.img;
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
        cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
            if (cart[i].qt>1){
                cart[i].qt--;
               
            }
            else{
                cart.splice(i,1);
            }
            updateCart();
           
        });
        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
            cart[i].qt++;
            updateCart();
        });
        c('.cart').append(cartItem);
    }
     desconto = subtotal * 0.1;
     total = subtotal - desconto;
     c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
     c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
     c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
} else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
}
}
    

     
        
    



    