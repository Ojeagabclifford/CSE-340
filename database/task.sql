SELECT * FROM public.account;

INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  account_type
  
  )
  VALUES
  (
    'Tony',
     'Stark','
     tony@starkent.com', 
     'Iam1ronM@n',
     'Admin'
  );

DELETE FROM public.account
WHERE account_id =1;

UPDATE public.inventory
SET int_description =REPLACE(int_description,'the small interiors','a huge interior')
WHERE inv_id = 10;


SELECT 
  i.inv_make, 
  i.inv_model, 
  c.classification_name
FROM 
  public.inventory i
INNER JOIN 
  public.classification c
ON 
  i.classification_id = c.classification_id
WHERE 
  c.classification_name = 'Sport';

UPDATE public.inventory
SET inv_image=REPLACE(inv_image,'/images/','/images/vehicles/'),
inv_thumbnail=REPLACE(INV_thumbnail,'/images/','/images/vehicles/');