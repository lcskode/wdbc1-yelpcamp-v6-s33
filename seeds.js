var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

// define an array to add sample data
var data = [
  {
    name: "Sapang Palay View",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d9df10d159cc11074d9a7996e8aca442&auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cumque modi alias repellat tenetur, non voluptatem ipsa eaque iure perferendis praesentium itaque. Animi architecto quasi rerum tempore, autem quas laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem repudiandae esse quibusdam soluta delectus recusandae non, nulla dignissimos voluptatum, consequuntur qui odio in ea maiores. Nulla maxime id ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptate placeat laudantium. Sit unde quidem voluptatem, maiores sint vel iste exercitationem provident natus eum vitae! Quae similique facere sunt nemo."
  },
  {
    name: "Meycauayan Town",
    image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d95171e276fbd03de651f9aecb64b53d&auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cumque modi alias repellat tenetur, non voluptatem ipsa eaque iure perferendis praesentium itaque. Animi architecto quasi rerum tempore, autem quas laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem repudiandae esse quibusdam soluta delectus recusandae non, nulla dignissimos voluptatum, consequuntur qui odio in ea maiores. Nulla maxime id ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptate placeat laudantium. Sit unde quidem voluptatem, maiores sint vel iste exercitationem provident natus eum vitae! Quae similique facere sunt nemo."
  },
  {
    name: "Norzagaray Hills",
    image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5cedc6b95f731395da7269d2341f9a5e&auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cumque modi alias repellat tenetur, non voluptatem ipsa eaque iure perferendis praesentium itaque. Animi architecto quasi rerum tempore, autem quas laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem repudiandae esse quibusdam soluta delectus recusandae non, nulla dignissimos voluptatum, consequuntur qui odio in ea maiores. Nulla maxime id ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptate placeat laudantium. Sit unde quidem voluptatem, maiores sint vel iste exercitationem provident natus eum vitae! Quae similique facere sunt nemo."
  },
  {
    name: "Bagong Buhay Park",
    image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ffdbb5e90a2c129258d4540ef0f29d06&auto=format&fit=crop&w=1050&q=80",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur cumque modi alias repellat tenetur, non voluptatem ipsa eaque iure perferendis praesentium itaque. Animi architecto quasi rerum tempore, autem quas laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae autem repudiandae esse quibusdam soluta delectus recusandae non, nulla dignissimos voluptatum, consequuntur qui odio in ea maiores. Nulla maxime id ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex voluptate placeat laudantium. Sit unde quidem voluptatem, maiores sint vel iste exercitationem provident natus eum vitae! Quae similique facere sunt nemo."
  },
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("removed campgrounds");

      // Add a few campgrounds
      // Loop through data to create each object from data array a campground data
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if (err) {
            console.log(err);
          } else {
            console.log("Added a campground");
            // Add a comment on each campground
            Comment.create(
              {
                text: "This place is great, but I wish there was internet.",
                author: "Homer"
              }, function(err, comment){
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment.");
                }
            });
          }
        });
      });
    }
  });
}

// export to use in app.js
module.exports = seedDB;