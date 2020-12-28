process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
  describe('/api', () => {
    describe('/recipes', () => {
      describe('GET', () => {
        it('Status: 200 responds with all recipes in the database', () => {
          return request(app)
            .get('/api/recipes')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.an('array');
              expect(recipes[0]).to.include.keys(
                'recipe_id',
                'author_id',
                'name',
                'description',
                'quantity',
                'unit',
                'last_made',
                'rating',
                'completion_count',
                'comment_count'
              );
              expect(recipes[0].categories).to.be.an('array');
              expect(recipes[0].categories[0]).to.include.keys(
                'category_id',
                'name',
                'slug',
                'recipe_count'
              );
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by ascending A-Z by default', () => {
          return request(app)
            .get('/api/recipes')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('name', {
                ascending: true,
              });
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by descending A-Z by user query', () => {
          return request(app)
            .get('/api/recipes?sort_by=name&order=desc')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('name', {
                descending: true,
              });
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by time created by user query', () => {
          return request(app)
            .get('/api/recipes?sort_by=last_made')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('last_made', {
                ascending: true,
              });
            });
        });
        it('Status: 200 responds with the first 10 recipes in the database', () => {
          return request(app)
            .get('/api/recipes')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.have.lengthOf.lessThan(11);
            });
        });
        it('Status: 200 responds the first 10 recipes in a certain category', () => {
          return request(app)
            .get('/api/recipes?category=3')
            .expect(200)
            .then(({ body: { recipes } }) => {
              const categories = recipes[0].categories.map(
                (category) => category.slug
              );
              expect(categories).to.include('doughnuts');
            });
        });
        it('Status: 200 responds the first 10 recipes in a certain author', () => {
          return request(app)
            .get('/api/recipes?author=1')
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes[0].author_id).to.equal(1);
            });
        });
      });
      describe('POST', () => {
        it('Status: 201 responds with the posted recipe', () => {
          const recipe = {
            name: 'Doughnut Dough',
            author_id: 1,
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
            categories: [{ category_id: 1 }, { category_id: 3 }],
          };
          return request(app)
            .post('/api/recipes')
            .send(recipe)
            .expect(201)
            .then(({ body: { recipe } }) => {
              expect(recipe).to.deep.include({
                name: 'Doughnut Dough',
                description:
                  "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
                author_id: 1,
                quantity: '20.00',
                unit: 'Doughnuts',
                rating: '5.00',
                completion_count: 0,
                comment_count: 0,
              });
            });
        });
        it('Status: 400 responds with Bad request when trying to insert non-existant column', () => {
          const recipe = {
            names: 'Doughnut Dough',
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            author_id: 1,
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
            categories: [{ category_id: 1 }, { category_id: 6 }],
          };

          return request(app)
            .post('/api/recipes')
            .send(recipe)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Bad Request!!');
            });
        });
        it('Status: 400 responds with Bad request when trying to a column is missing from recipe body', () => {
          const recipe = {
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            author: 'Bread Ahead',
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
          };

          return request(app)
            .post('/api/recipes')
            .send(recipe)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Bad Request!!');
            });
        });
      });
      describe('/:recipe_id', () => {
        describe('DELETE', () => {
          it('Status: 204 no response when recipe is deleted', () => {
            return request(app).delete('/api/recipes/1').expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            return request(app)
              .delete('/api/recipes/t')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Recipe Not Found message when trying to delete recipe that does not exist', () => {
            return request(app)
              .delete('/api/recipes/5000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Recipe Not Found');
              });
          });
        });
        describe('PATCH', () => {
          it('Status: 200 responds with the updated recipe', () => {
            const updateRecipe = { rating: 3 };
            return request(app)
              .patch('/api/recipes/1')
              .send(updateRecipe)
              .expect(200)
              .then(({ body: { recipe } }) => {
                expect(recipe.rating).to.equal('3.00');
              });
          });
          it('Status: 404 responds with recipe not found message', () => {
            const updateRecipe = { rating: 3 };
            return request(app)
              .patch('/api/recipes/5000')
              .send(updateRecipe)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Recipe Not Found');
              });
          });
        });
      });
    });
    describe('/categories', () => {
      describe.only('GET', () => {
        it('Status: 200 responds with all categories in the database', () => {
          return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body: { categories } }) => {
              expect(categories).to.be.an('array');
              expect(categories[0]).to.include.keys(
                'name',
                'slug',
                'recipe_count'
              );
            });
        });
      });
    });
  });
});
