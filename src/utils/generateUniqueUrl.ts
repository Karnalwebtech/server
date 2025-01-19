async function generateUniqueUrl(slug:string, model:any, name:string): Promise<string> {
    let url = slug;
    // Initial URL assignment
    // let url = slug;
    // Dynamic property name syntax fix
    let is_exist = await model.findOne({ [name]: url });
  
    let counter = 1;
  
    // Loop to find a unique URL
    while (is_exist) {
      // Update URL with counter
      url = `${slug}-${counter}`;
      // Check if the new URL exists
      is_exist = await model.findOne({ [name]: url });
      counter++;
    }
  
    // Return the unique URL
    return url;
  }
  export default generateUniqueUrl;