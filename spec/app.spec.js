process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;

const chaiSorted = require('chai-sorted');
const assertArrays = require('chai-arrays');

chai.use(chaiSorted);
chai.use(assertArrays);

const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
  describe('/api', () => {
    describe('/recipes', () => {
      describe('GET', () => {
        it('Status: 200 responds with all public recipes in the database', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              const public = recipes.map((recipe) => recipe.public);

              expect(recipes).to.be.an('array');
              expect(recipes[0]).to.include.keys(
                'recipe_id',
                'user_id',
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
              expect(public).to.contain(true).and.not.contain(false);
              expect(recipes[0].categories).to.be.an('array');
              expect(recipes[0].categories[0]).to.include.keys(
                'category_id',
                'name',
                'slug',
                'recipe_count'
              );
            });
        });
        it('Status: 200 responds with all private recipes in the database for the logged in user', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?public=private&user=1')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              const public = recipes.map((recipe) => recipe.public);
              const user = recipes.map((recipe) => recipe.user_id === 1);

              expect(user).to.contain(true).and.not.contain(false);
              expect(public).to.contain(false).and.not.contain(true);
            });
        });
        it('Status: 200 responds with the public recipes for a certain user', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?user=2&public=public')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              const public = recipes.map((recipe) => recipe.public);
              const user = recipes.map((recipe) => recipe.user_id === 2);

              expect(public).to.contain(true).and.not.contain(false);
              expect(user).to.contain(true).and.not.contain(false);
            });
        });
        it('Status: 200 responds with the public recipes when no access token is provided', () => {
          return request(app)
            .get('/api/recipes')
            .expect(200)
            .then(({ body: { recipes } }) => {
              const public = recipes.map((recipe) => recipe.public);
              expect(public).to.contain(true).and.not.contain(false);
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by ascending A-Z by default', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('name', {
                ascending: true,
              });
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by descending A-Z by user query', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?sort_by=name&order=desc')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('name', {
                descending: true,
              });
            });
        });
        it('Status: 200 responds with all recipes in the database sorted by time created by user query', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?sort_by=last_made')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.be.sortedBy('last_made', {
                ascending: true,
              });
            });
        });
        it('Status: 200 responds with the first 10 recipes in the database', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              expect(recipes).to.have.lengthOf.lessThan(11);
            });
        });
        it('Status: 200 responds the first 10 recipes in a certain category', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?category=1')
            .set(header)
            .expect(200)
            .then(({ body: { recipes } }) => {
              const categories = recipes[0].categories.map(
                (category) => category.slug
              );
              expect(categories).to.include('sweet');
            });
        });
        it('Status: 400 responds with bad request when sort_by query has a non-existant column', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?sort_by=voted')
            .set(header)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad Request!!');
            });
        });
        it('Status: 400 responds with bad request when request is for private posts but no user specified', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?public=private')
            .set(header)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad Request!!');
            });
        });
        it('Status: 401 responds with unauthorized access request private recipes for non logged in account', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          return request(app)
            .get('/api/recipes?user=2&public=private')
            .set(header)
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Unauthorized Access');
            });
        });
      });
      describe('POST', () => {
        it('Status: 201 responds with the posted recipe', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          const recipe = {
            name: 'Doughnut Dough',
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
            duration: 3600,
            difficulty: 'easy',
            public: true,
            categories: [{ category_id: 1 }, { category_id: 3 }],
            instructions: [
              {
                index: 0,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
              {
                index: 1,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
              {
                index: 2,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
            ],
            ingredients: [
              {
                index: 0,
                name: 'Strong White Bread Flour',
                quantity: 500,
                unit: 'g',
              },
              {
                index: 1,
                name: 'Caster Sugar',
                quantity: 60,
                unit: 'g',
              },
              {
                index: 2,
                name: 'Dried Yeast',
                quantity: 8,
                unit: 'g',
              },
            ],
          };
          return request(app)
            .post('/api/recipes')
            .set(header)
            .send(recipe)
            .expect(201)
            .then(({ body: { recipe } }) => {
              expect(recipe).to.deep.include({
                name: 'Doughnut Dough',
                description:
                  "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
                user_id: 1,
                quantity: '20.00',
                unit: 'Doughnuts',
                rating: '5.00',
                completion_count: 0,
                comment_count: 0,
                categories: [
                  { recipes_category_id: 8, category_id: 1, recipe_id: 5 },
                  { recipes_category_id: 9, category_id: 3, recipe_id: 5 },
                ],
                instructions: [
                  {
                    instruction_id: 7,
                    recipe_id: 5,
                    body:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    index: 0,
                    comment_count: 0,
                  },
                  {
                    instruction_id: 8,
                    recipe_id: 5,
                    body:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    index: 1,
                    comment_count: 0,
                  },
                  {
                    instruction_id: 9,
                    recipe_id: 5,
                    body:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    index: 2,
                    comment_count: 0,
                  },
                ],
                ingredients: [
                  {
                    ingredient_id: 15,
                    recipe_id: 5,
                    index: 0,
                    name: 'Strong White Bread Flour',
                    quantity: '500.00000',
                    unit: 'g',
                  },
                  {
                    ingredient_id: 16,
                    recipe_id: 5,
                    index: 1,
                    name: 'Caster Sugar',
                    quantity: '60.00000',
                    unit: 'g',
                  },
                  {
                    ingredient_id: 17,
                    recipe_id: 5,
                    index: 2,
                    name: 'Dried Yeast',
                    quantity: '8.00000',
                    unit: 'g',
                  },
                ],
              });
            });
        });
        it('Status: 400 responds with Bad request when trying to insert non-existant column', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
          const recipe = {
            names: 'Doughnut Dough',
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
            categories: [{ category_id: 1 }, { category_id: 6 }],
          };

          return request(app)
            .post('/api/recipes')
            .set(header)
            .send(recipe)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Bad Request!!');
            });
        });
        it('Status: 400 responds with Bad request when trying to a column is missing from recipe body', () => {
          const header = {
            'x-access-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
          };
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
            .set(header)
            .send(recipe)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Bad Request!!');
            });
        });
        it('Status: 401 responds Unauthorized Access when posting a recipe with no authenitcation token', () => {
          const recipe = {
            name: 'Doughnut Dough',
            description:
              "Bread Ahead's famous doughnut recipe. A long rise allows the lemon zest to bleed out into the dough to make an amazing doughnut",
            quantity: 20,
            unit: 'Doughnuts',
            rating: 5,
            duration: 3600,
            difficulty: 'easy',
            public: true,
            categories: [{ category_id: 1 }, { category_id: 3 }],
            instructions: [
              {
                index: 0,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
              {
                index: 1,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
              {
                index: 2,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                comment_count: 0,
              },
            ],
            ingredients: [
              {
                index: 0,
                name: 'Strong White Bread Flour',
                quantity: 500,
                unit: 'g',
              },
              {
                index: 1,
                name: 'Caster Sugar',
                quantity: 60,
                unit: 'g',
              },
              {
                index: 2,
                name: 'Dried Yeast',
                quantity: 8,
                unit: 'g',
              },
            ],
          };
          return request(app)
            .post('/api/recipes')
            .send(recipe)
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).to.deep.equal('Unauthorized Access');
            });
        });
      });
      describe('/:recipe_id', () => {
        describe('DELETE', () => {
          it('Status: 204 no response when recipe is deleted', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };
            return request(app)
              .delete('/api/recipes/1')
              .set(header)
              .expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };
            return request(app)
              .delete('/api/recipes/t')
              .set(header)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Recipe Not Found message when trying to delete recipe that does not exist', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };
            return request(app)
              .delete('/api/recipes/5000')
              .set(header)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Recipe Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when deleting a recipe with no authenitcation token', () => {
            return request(app)
              .delete('/api/recipes/1')
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
        describe('PATCH', () => {
          it('Status: 200 responds with the updated recipe', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };
            const updateRecipe = { rating: 3 };

            return request(app)
              .patch('/api/recipes/1')
              .set(header)
              .send(updateRecipe)
              .expect(200)
              .then(({ body: { recipe } }) => {
                expect(recipe.rating).to.equal('3.00');
              });
          });
          it('Status: 404 responds with recipe not found message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };
            const updateRecipe = { rating: 3 };

            return request(app)
              .patch('/api/recipes/5000')
              .set(header)
              .send(updateRecipe)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Recipe Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when updating a recipe with no authenitcation token', () => {
            const updateRecipe = { rating: 3 };

            return request(app)
              .patch('/api/recipes/1')
              .send(updateRecipe)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
        describe('/instructions', () => {
          describe('GET', () => {
            it('Status: 200 responds with all instructions for the requested recipe', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };
              return request(app)
                .get('/api/recipes/1/instructions')
                .set(header)
                .expect(200)
                .then(({ body: { instructions } }) => {
                  expect(instructions).to.be.an('array');
                  expect(instructions[0]).to.include.keys(
                    'instruction_id',
                    'recipe_id',
                    'body',
                    'comment_count'
                  );
                  expect(instructions).to.be.sortedBy('index', {
                    ascending: true,
                  });
                });
            });
            it('Status: 404 responds with Recipe Not Found message when trying to get instructions for a recipe that does not exist', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };
              return request(app)
                .get('/api/recipes/5000/instructions')
                .set(header)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Recipe Not Found');
                });
            });
            it('Status: 400 responds with Bad Request message', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };
              return request(app)
                .get('/api/recipes/t/instructions')
                .set(header)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
            it('Status: 401 responds Unauthorized Access when get instructions for a private recipe with no authenitcation token', () => {
              return request(app)
                .get('/api/recipes/3/instructions')
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Unauthorized Access');
                });
            });
          });
        });
        describe('/ingredients', () => {
          describe('GET', () => {
            it('Status: 200 responds with all ingredients for the requested recipe', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/1/ingredients')
                .set(header)
                .expect(200)
                .then(({ body: { ingredients } }) => {
                  expect(ingredients).to.be.an('array');
                  expect(ingredients[0]).to.include.keys(
                    'ingredient_id',
                    'recipe_id',
                    'name',
                    'quantity',
                    'unit',
                    'index'
                  );
                  expect(ingredients).to.be.sortedBy('index', {
                    ascending: true,
                  });
                });
            });
            it('Status: 404 responds with Recipe Not Found message when trying to get ingredients for a recipe that does not exist', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/5000/ingredients')
                .set(header)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Recipe Not Found');
                });
            });
            it('Status: 400 responds with Bad Request message', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/t/ingredients')
                .set(header)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
            it('Status: 401 responds Unauthorized Access when get ingredients for a private recipe with no authenitcation token', () => {
              return request(app)
                .get('/api/recipes/3/ingredients')
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Unauthorized Access');
                });
            });
          });
        });
        describe('/comments', () => {
          describe('GET', () => {
            it('Status: 200 responds with all ingredients for the requested recipe', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/1/comments')
                .set(header)
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an('array');
                  expect(comments[0]).to.include.keys(
                    'recipe_id',
                    'body',
                    'date_posted',
                    'user_id',
                    'recipe_comment_id'
                  );
                  expect(comments).to.be.sortedBy('date_posted', {
                    ascending: true,
                  });
                });
            });
            it('Status: 404 responds with Recipe Not Found message when trying to get ingredients for a recipe that does not exist', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/5000/comments')
                .set(header)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Recipe Not Found');
                });
            });
            it('Status: 400 responds with Bad Request message', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              return request(app)
                .get('/api/recipes/t/comments')
                .set(header)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
            it('Status: 401 responds Unauthorized Access when get ingredients for a private recipe with no authenitcation token', () => {
              return request(app)
                .get('/api/recipes/3/comments')
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Unauthorized Access');
                });
            });
          });
          describe('POST', () => {
            it('Status: 201 responds with the posted comment', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              const comment = {
                user_id: 2,
                date_posted: null,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              };
              return request(app)
                .post('/api/recipes/1/comments')
                .set(header)
                .send(comment)
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).to.deep.include({
                    user_id: 2,
                    body:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  });
                });
            });
            it('Status: 400 responds with Bad request when trying to insert non-existant column', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              const comment = {
                user: 2,
                date_posted: null,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              };

              return request(app)
                .post('/api/recipes/1/comments')
                .set(header)
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
            it('Status: 400 responds with Bad request when trying to a column is missing from comment body', () => {
              const header = {
                'x-access-token':
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
              };

              const comment = {
                user: 2,
                date_posted: null,
              };

              return request(app)
                .post('/api/recipes/1/comments')
                .set(header)
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
            it('Status: 401 responds Unauthorized Access when get post a comment with with no authenitcation token', () => {
              const comment = {
                user_id: 2,
                date_posted: null,
                body:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              };

              return request(app)
                .post('/api/recipes/1/comments')
                .send(comment)
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Unauthorized Access');
                });
            });
          });
        });
      });
    });
    describe('/instructions', () => {
      describe('/:instruction_id', () => {
        describe('PATCH', () => {
          it('Status: 200 responds with the updated instruction', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedInstruction = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/instructions/1')
              .set(header)
              .send(updatedInstruction)
              .expect(200)
              .then(({ body: { instruction } }) => {
                expect(instruction.body).to.equal(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                );
              });
          });
          it('Status: 404 responds with ingredient not found message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedInstruction = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/instructions/5000')
              .set(header)
              .send(updatedInstruction)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Instruction Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when updating an instruction with with no authenitcation token', () => {
            const updatedInstruction = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };

            return request(app)
              .patch('/api/instructions/1')
              .send(updatedInstruction)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
        describe('DELETE', () => {
          it('Status: 204 no response when instruction is deleted', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/instructions/1')
              .set(header)
              .expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/instructions/t')
              .set(header)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Instruction Not Found message when trying to delete instruction that does not exist', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/instructions/5000')
              .set(header)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Instruction Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when updating an instruction with with no authenitcation token', () => {
            return request(app)
              .delete('/api/instructions/1')
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
      });
    });
    describe('/ingredients', () => {
      describe('/:ingredient_id', () => {
        describe('PATCH', () => {
          it('Status: 200 responds with the updated ingredient', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedIngredient = {
              quantity: 5,
            };
            return request(app)
              .patch('/api/ingredients/1')
              .set(header)
              .send(updatedIngredient)
              .expect(200)
              .then(({ body: { ingredient } }) => {
                expect(ingredient.quantity).to.equal('5.00000');
              });
          });
          it('Status: 404 responds with Ingredient not found message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedIngredient = {
              quantity: 5,
            };
            return request(app)
              .patch('/api/ingredients/5000')
              .set(header)
              .send(updatedIngredient)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Ingredient Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when updating an ingredient with with no authenitcation token', () => {
            const updatedIngredient = {
              quantity: 5,
            };

            return request(app)
              .patch('/api/ingredients/1')
              .send(updatedIngredient)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
        describe('DELETE', () => {
          it('Status: 204 no response when ingredient is deleted', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/ingredients/1')
              .set(header)
              .expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/ingredients/t')
              .set(header)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Ingredient Not Found message when trying to delete ingredient that does not exist', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/ingredients/5000')
              .set(header)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Ingredient Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when deleting an instruction with with no authenitcation token', () => {
            return request(app)
              .delete('/api/ingredients/1')
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
      });
    });
    describe('/categories', () => {
      describe('GET', () => {
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
    describe.only('/recipe-comments', () => {
      describe('/:comment_id', () => {
        describe('DELETE', () => {
          it('Status: 204 no response when a recipe comment is deleted', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/recipe-comments/1')
              .set(header)
              .expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/recipe-comments/t')
              .set(header)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Comment Not Found message when trying to delete comment that does not exist', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            return request(app)
              .delete('/api/recipe-comments/5000')
              .set(header)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Comment Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when deleting a comment with no authenitcation token', () => {
            return request(app)
              .delete('/api/recipe-comments/1')
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
        describe('PATCH', () => {
          it('Status: 200 responds with the updated instruction', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedComment = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/recipe-comments/1')
              .set(header)
              .send(updatedComment)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.body).to.equal(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                );
              });
          });
          it('Status: 404 responds with comment not found message', () => {
            const header = {
              'x-access-token':
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IlJtUGlsbGFyIiwiaWF0IjoxNTE2MjM5MDIyfQ.zWaK2bd94faOWkmPwgyeGNcNLPThWXEQiz0oIAMhVyc',
            };

            const updatedComment = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/recipe-comments/5000')
              .set(header)
              .send(updatedComment)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Comment Not Found');
              });
          });
          it('Status: 401 responds Unauthorized Access when updating a comment with with no authenitcation token', () => {
            const updatedComment = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };

            return request(app)
              .patch('/api/recipe-comments/1')
              .send(updatedComment)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unauthorized Access');
              });
          });
        });
      });
    });
    describe('/instruction-comments', () => {
      describe('/:comment_id', () => {
        describe('DELETE', () => {
          it('Status: 204 no response when a instruction comment is deleted', () => {
            return request(app)
              .delete('/api/instruction-comments/1')
              .expect(204);
          });
          it('Status: 400 responds with Bad Request message', () => {
            return request(app)
              .delete('/api/instruction-comments/t')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with Comment Not Found message when trying to delete comment that does not exist', () => {
            return request(app)
              .delete('/api/instruction-comments/5000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Comment Not Found');
              });
          });
        });
        describe('PATCH', () => {
          it('Status: 200 responds with the updated instruction', () => {
            const updatedComment = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/instruction-comments/1')
              .send(updatedComment)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.body).to.equal(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                );
              });
          });
          it('Status: 404 responds with comment not found message', () => {
            const updatedComment = {
              body:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            };
            return request(app)
              .patch('/api/instruction-comments/5000')
              .send(updatedComment)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Comment Not Found');
              });
          });
        });
      });
    });
    describe('/users', () => {
      describe('/register', () => {
        describe('POST', () => {
          it('Status: 201 responds with an authentication JWT', () => {
            const userDetails = {
              name: 'Test',
              username: 'Test123',
              email: 'test@test.co.uk',
              password: 'password',
            };

            return request(app)
              .post('/api/users/register')
              .send(userDetails)
              .expect(201)
              .then(({ body }) => {
                expect(body.token).to.be.a('string');
                expect(body.auth).to.equal(true);
              });
          });
          it('Status: 400 responds with Bad request when trying to insert non-existant column', () => {
            const userDetails = {
              fullName: 'Test',
              username: 'Test123',
              email: 'test@test.co.uk',
              password: 'password',
            };

            return request(app)
              .post('/api/users/register')
              .send(userDetails)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 400 responds with Bad request when trying to a column is missing from recipe body', () => {
            const userDetails = {
              username: 'Test123',
              email: 'test@test.co.uk',
              password: 'password',
            };

            return request(app)
              .post('/api/users/register')
              .send(userDetails)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
        });
      });
      describe('/login', () => {
        describe('/POST', () => {
          it('Status: 201 responds with an authentication JWT', () => {
            const loginDetails = {
              email: 'email@email.com',
              password: 'password',
            };

            return request(app)
              .post('/api/users/login')
              .send(loginDetails)
              .expect(201)
              .then(({ body }) => {
                expect(body.token).to.be.a('string');
                expect(body.auth).to.equal(true);
              });
          });
          it('Status: 401 responds with invalid login when incorrect login details used', () => {
            const loginDetails = {
              email: 'email@email.com',
              password: 'password1',
            };

            return request(app)
              .post('/api/users/login')
              .send(loginDetails)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Invalid username or password');
              });
          });
        });
      });
    });
  });
});
