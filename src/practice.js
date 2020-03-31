require('dotenv').config();
const knex = require('knex');


const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

const qry = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({
    name: 'Point of view gun'
  })
  .first()
  .toQuery();

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

function searchByShopping(searchTerm) {
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });

}
//searchByShopping('Tofurkey');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

function paginateShoppingList(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber -1);
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
        console.log(result);
    })
}
//paginateShoppingList(3)

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result);
    });
}

function totalCost() {
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    // .orderBy([
    //   { column: 'category', order: 'DESC'}
    // ])
    .then(result => {
      console.log(result)
    })
}

totalCost()

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result);
    });
}

function addedAfterDate(daysAgo) {
  knexInstance
    .select('name', 'category')
    // .count('date_added AS added')
    .where('date_added', '>', 
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .from('shopping_list')
    .groupBy('name', 'category')
    .then(results => {
      console.log(results)
    })
}

//addedAfterDate(5)

// mostPopularVideosForDays(30);

//getProductsWithImages()
//paginateProducts(1)

//searchByProduceName('holo')
