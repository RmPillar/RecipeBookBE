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
      describe.only('/:recipe_id', () => {
        it('Status: 200 responds with requested recipe', () => {
          return request(app)
            .get('/api/recipes/1')
            .expect(200)
            .then(({ body: { recipe } }) => {
              expect(recipe).to.be.an('object');
              expect(recipe).to.include.keys(
                'recipe_id',
                'author_id',
                'name',
                'description',
                'quantity',
                'unit',
                'last_made',
                'rating',
                'completion_count',
                'comment_count',
                'categories'
              );
              expect(recipe.categories).to.be.an('array');
              expect(recipe.categories[0]).to.include.keys(
                'recipes_category_id',
                'recipe_id',
                'category_id'
              );
            });
        });
        it('Status: 404 responds with Not Found when recipe does not exist', () => {
          return request(app)
            .get('/api/recipes/9999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Recipe Not Found');
            });
        });
        it('Status: 400 responds with Bad Request when recipe_id is a string', () => {
          return request(app)
            .get('/api/recipes/one')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Bad Request!!');
            });
        });
      });
    });
  });
});
