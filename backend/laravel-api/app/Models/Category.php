<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $CategoryID
 * @property string $Name
 * @property Carbon|null $CreatedAt
 * 
 * @property Collection|Album[] $albums
 *
 * @package App\Models
 */
class Category extends Model
{
	protected $table = 'Category';
	protected $primaryKey = 'CategoryID';
	public $timestamps = false;

	protected $casts = [
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Name',
		'CreatedAt'
	];

	public function albums()
	{
		return $this->hasMany(Album::class, 'CategoryID');
	}
}
