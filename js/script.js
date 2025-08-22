var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    grabCursor: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });


  const faqs = document.querySelectorAll('.faq');
  faqs.forEach(faq => {
    faq.addEventListener('click', () => {
      faq.classList.toggle('open');

      const icon = faq.querySelector('.faq_icon i');
      if(icon.className === 'bi bi-plus'){
        icon.className = "bi bi-dash"
      } else {
        icon.className = "bi bi-plus";
      }
    })
  })


  //
  document.addEventListener('DOMContentLoaded', function () {
    const blogLeftContainer = document.querySelector('.blog-left');

    async function fetchBlogPosts() {
        try {
            const response = await fetch('https://shengez.co.za/data/blogs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blogPosts = await response.json();

            blogPosts.forEach(post => {
                const blogContainer = document.createElement('div');
                blogContainer.classList.add('container-b');
                blogContainer.setAttribute('data-blog-id', post.id);

                // Get short URL - use shortUrl field if available, otherwise create from ID
                const shortCode = post.shortUrl || post.id.replace('blog-', '');
                const shortUrl = `https://shengez.co.za/b/${shortCode}`;

                blogContainer.innerHTML = `
                    <img src="${post.image}" alt="${post.alt}">
                    <h2>${post.title}</h2>
                    <p>${post.short_description}</p>
                   <span class="read-more-btn-b">
                        <a href="${shortUrl}" style="text-decoration: none; color: grey;">Read More...</a>
                    </span>
                `;
                blogLeftContainer.appendChild(blogContainer);
            });

        } catch (error) {
            console.error('Error fetching blog posts:', error);
            blogLeftContainer.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
        }
    }

    fetchBlogPosts();

    // Menu controls
    var navLinks = document.getElementById("navLinks");
    window.showMenu = function() {
        navLinks.style.right = "0";
    }
    window.hideMenu = function() {
        navLinks.style.right = "-200px";
    }

    // Disable right-click
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
});















/*************************************Analysis code**************************************/

const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Sorting | Ordering data of HTML table

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})


function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

// 3. Converting HTML table to PDF

const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#customers_table');


const toPDF = function (customers_table) {
    const html_code = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="style.css">
    <main class="table" id="customers_table">${customers_table.innerHTML}</main>`;

    const new_window = window.open();
     new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
}

pdf_btn.onclick = () => {
    toPDF(customers_table);
}

// 4. Converting HTML table to JSON

const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    let table_data = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll('td');

        t_cells.forEach((t_cell, cell_index) => {
            const img = t_cell.querySelector('img');
            if (img) {
                row_object['customer image'] = decodeURIComponent(img.src);
            }
            row_object[t_head[cell_index]] = t_cell.textContent.trim();
        })
        table_data.push(row_object);
    })

    return JSON.stringify(table_data, null, 4);
}

json_btn.onclick = () => {
    const json = toJSON(customers_table);
    downloadFile(json, 'json')
}

// 5. Converting HTML table to CSV File

const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join(',');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return data_without_img + ',' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'customer orders');
}

// 6. Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return data_without_img + '\t' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
















/*************************************Pop Up code**************************************/



function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

var offsetX, offsetY;

function dragStart(e) {
    e.preventDefault(); // Prevent default behavior for both mouse and touch events
    var rect = document.getElementById('popup').getBoundingClientRect();
    offsetX = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    offsetY = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    if (e.type === 'mousedown') {
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    } else if (e.type === 'touchstart') {
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('touchend', dragEnd);
    }
}

function dragMove(e) {
    e.preventDefault(); // Prevent default behavior for both mouse and touch events
    var newX, newY;

    if (e.clientX) {
        newX = e.clientX - offsetX;
        newY = e.clientY - offsetY;
    } else if (e.touches.length === 1) {
        newX = e.touches[0].clientX - offsetX;
        newY = e.touches[0].clientY - offsetY;
    }

    document.getElementById('popup').style.left = newX + 'px';
    document.getElementById('popup').style.top = newY + 'px';
}

function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', dragEnd);
}